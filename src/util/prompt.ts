export const movieSuggestionsPrompt = `
Provide a list of four top-rated (≥7 on IMDb or similar reputable rating sites) Bollywood and Hollywood movies released between 2010 and 2024. Ensure that each response contains two different Bollywood movies and two different Hollywood movies, and the selections are varied each time. Include the following information for each movie:

1. Movie title
2. Release year
3. IMDb rating (or rating from a similar reputable site)
4. Available streaming platforms (e.g., Netflix, Amazon Prime Video, Disney+ Hotstar)
5. Don't include any other text other than the tables and its data in the response.
6. Use two separate tables for Bollywood and Hollywood and use the same table layout for both as mentioned below.
7. Avoid repeating any movie titles that have already been suggested in previous responses. Each response must present entirely new movies.

Present the results as an HTML table with the following columns:
1. Movie Title
2. Release Year
3. Rating
4. Where to Watch

The table should have the following styling:
- A border around each cell
- An outer border for the entire table
- Properly aligned and color-styled headers
- Alternating row colors for better readability
- Don't have any other text in the response other than what's mentioned in the below HTML structure.

Use this HTML structure ONLY:
<h3 style="color:teal; font-family: 'Open Sans', Arial, sans-serif;">[Hollywood/bollywood] Movies</h3>
<table style="border-collapse: collapse; width: 100%; font-family: 'Open Sans', Arial, sans-serif; border-radius: 8px; overflow: hidden;">
  <tr style="background-color: #f2f2f2;">
    <th style="border: 1px solid #cccccc; padding: 10px; text-align: left; color: #333;">Movie Title</th>
    <th style="border: 1px solid #cccccc; padding: 10px; text-align: left; color: #333;">Release Year</th>
    <th style="border: 1px solid #cccccc; padding: 10px; text-align: left; color: #333;">Rating</th>
    <th style="border: 1px solid #cccccc; padding: 10px; text-align: left; color: #333;">Where to Watch</th>
  </tr>
  <tr>
    <td style="border: 1px solid #cccccc; padding: 10px; color: #666;">[Movie Title 1]</td>
    <td style="border: 1px solid #cccccc; padding: 10px; color: #666;">[Release Year 1]</td>
    <td style="border: 1px solid #cccccc; padding: 10px; color: #666;">[Rating 1]</td>
    <td style="border: 1px solid #cccccc; padding: 10px; color: #666;">[Streaming Platforms 1]</td>
  </tr>
  <tr style="background-color: #f9f9f9;">
    <td style="border: 1px solid #cccccc; padding: 10px; color: #666;">[Movie Title 2]</td>
    <td style="border: 1px solid #cccccc; padding: 10px; color: #666;">[Release Year 2]</td>
    <td style="border: 1px solid #cccccc; padding: 10px; color: #666;">[Rating 2]</td>
    <td style="border: 1px solid #cccccc; padding: 10px; color: #666;">[Streaming Platforms 2]</td>
  </tr>
</table>
Please ensure that the information provided is accurate and up-to-date as of 2024.
`;
