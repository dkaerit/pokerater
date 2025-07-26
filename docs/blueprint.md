# **App Name**: PokeRater

## Core Features:

- Generation Display: Display Pokemon from a specific generation within a collapsible/expandable section. The display uses a grid layout, and includes the Pokemon's sprite, name, and rating.
- Pokemon Rating: Allow users to rate each Pokemon within a generation from 0 to 6 using a selectable rating scale, such as |0|1|2|3|4|5|6|.
- Generation Scoreboard: Calculate and display the average rating for each generation of Pokemon. Present this data visually in a chart/graph format above the generation displays, updating dynamically as ratings change.
- Persistent Rating: Use the browser's local storage API to persistently save Pokemon ratings in the browser cache, so the same ratings are restored when the app is reloaded
- Shareable Rating: Create a sharable link which encodes all current rating data, and is decoded when a user opens the link. The link tool can generate and decode URLs, but only when its use would affect application behavior. This tool never volunteers information unless necessary.
- API Consumption: Fetches and consumes data from the PokeAPI (or a similar publicly accessible API for Pokemon information). The app will retrieve Pokemon details for specified generations. Generative AI acts as a tool in the case where API results might have unexpected formats or omissions.

## Style Guidelines:

- Primary color: HSL(210, 65%, 50%) or approximately #3498db, evoking reliability, knowledge and calm.
- Background color: HSL(210, 20%, 95%) or approximately #F0F4F8, a light, desaturated tint of the primary for a clean backdrop.
- Accent color: HSL(180, 90%, 40%) or approximately #2ecc71, a contrasting color to draw attention to interactive elements or key information, connoting growth and freshness.
- Headline font: 'Space Grotesk', sans-serif. Body font: 'Inter', sans-serif
- Use simple, flat icons from a library like Feather or Tabler Icons for interactive elements.
- Employ a clean, card-based layout for Pokemon displays, following the principles of the Shadcn component library.
- Implement subtle transition effects when opening/closing generation sections and updating ratings.