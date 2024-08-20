import type {
  ExecutionContext,
  KVNamespace,
  ScheduledEvent,
} from '@cloudflare/workers-types';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Resend } from 'resend';
import { emailsToSend } from './util/emails';
import { movieSuggestionsPrompt } from './util/prompt';
import { extractMovieDetails } from './util';

export interface Env {
  RESEND_API_KEY: string;
  API_KEY: string;
  SUGGESTIONS_STORE: KVNamespace;
}

const sendEmail = async (content: string, env: Env) => {
  if (!env.RESEND_API_KEY) throw new Error('NO RESEND API KEY FOUND!');

  const resend = new Resend(env.RESEND_API_KEY);

  try {
    const { data, error } = await resend.emails.send({
      from: 'Suggestify <no-reply-suggestify@findbud.app>',
      to: emailsToSend,
      subject: 'Your Weekly Movie Recommendations!',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2 style="color: teal;">Here are your weekly Movie Recommendations - Time to binge watch!!</h2>
          <div>
            ${content}
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Failed to send email: ', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to send email:', error);
    return null;
  }
};

const getPreviousResponse = async (env: Env): Promise<string | null> => {
  try {
    return await env.SUGGESTIONS_STORE.get('previousResponse');
  } catch (error) {
    console.error('Error retrieving previous response:', error);
  }
  return null;
};

const updatePreviousResponse = async (env: Env, newResponse: string) => {
  try {
    const existingResponse = (await getPreviousResponse(env)) || '';
    const updatedResponse = `${existingResponse}\n\n${newResponse}`;

    await env.SUGGESTIONS_STORE.put('previousResponse', updatedResponse);
  } catch (error) {
    console.error('Error updating previous response:', error);
  }
};

export const getSuggestedMovies = async (
  prompt: string,
  env: Env
): Promise<string | undefined> => {
  if (!env.API_KEY) throw new Error('NO GOOGLE API KEY FOUND!');

  const genAI = new GoogleGenerativeAI(env.API_KEY as string);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-pro',
  });

  const previousResponse = await getPreviousResponse(env);
  let updatedPrompt = prompt;

  if (previousResponse) {
    updatedPrompt += `\n\nHere is the previous response. Please provide new suggestions that are not included in this list:\n${previousResponse}`;
  }

  try {
    const result = await model.generateContent(updatedPrompt);
    const response = result.response.text();

    await updatePreviousResponse(env, extractMovieDetails(response));
    return response;
  } catch (error) {
    console.error('Failed to generate a response: ', error);
  }
};

const generateMoviesAndSendEmail = async (env: Env) => {
  const response = await getSuggestedMovies(movieSuggestionsPrompt, env);
  if (!response) return;
  console.log('MOVIES GENERATED!');
  const data = await sendEmail(response, env);
  if (data?.id) {
    console.log('EMAIL SENT!', data?.id);
  }
};

export default {
  async fetch() {
    return new Response('Hello from Suggestify!', {
      headers: {
        'Content-Type': 'text/plain',
        'CF-IPCountry': 'IN',
      },
    });
  },

  async scheduled(_event: ScheduledEvent, env: Env, _ctx: ExecutionContext) {
    if (!emailsToSend.length)
      throw new Error(
        'No recipient email addresses found! Add some in /src/util/emails.ts file.'
      );

    await generateMoviesAndSendEmail(env);
  },
};
