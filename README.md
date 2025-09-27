# Rhythm-808: Retro Web Drum Machine

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/aaron-vigilante-marketing/generated-app-20250927-205435)

A visually striking, retro-themed clone of the Roland TR-808 drum machine with a 16-step sequencer, built for the modern web.

Rhythm-808 is a visually stunning, retro-themed web application that emulates the classic Roland TR-808 drum machine. The application features a 16-step sequencer allowing users to program beats for a variety of iconic 808 drum sounds like Kick, Snare, Hi-Hats, and Cymbals. The interface is designed to evoke the nostalgia of 90s web culture with pixel art, glitch effects, and a neon color palette on a dark, textured background. Key components include: a Master Control panel for play/stop and tempo adjustment; an Instrument Selector panel to choose sounds; and the core Step Sequencer Grid where patterns are created. The application uses the Web Audio API for low-latency sound playback, ensuring a responsive and authentic rhythm-making experience.

## Key Features

-   **16-Step Sequencer**: Easily program and visualize your drum patterns.
-   **Iconic 808 Sounds**: Includes classic sounds like Kick, Snare, Clap, and Hi-Hats.
-   **Retro 90s UI**: A nostalgic interface with pixel fonts, neon glows, and CRT effects.
-   **Master Controls**: Adjust global tempo (BPM) and control playback (Play/Stop/Clear).
-   **Real-time Interaction**: Add or remove notes on the fly while the sequencer is running.
-   **Low-Latency Audio**: Built with the Web Audio API for a responsive, musical experience.
-   **Fully Responsive**: Flawless layout and performance across all device sizes.

## Technology Stack

-   **Frontend**: React, Vite
-   **Styling**: Tailwind CSS, shadcn/ui
-   **State Management**: Zustand
-   **Animation**: Framer Motion
-   **Icons**: Lucide React
-   **Deployment**: Cloudflare Pages & Workers

## Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or later)
-   [Bun](https://bun.sh/) package manager

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/rhythm_808.git
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd rhythm_808
    ```

3.  **Install dependencies:**
    ```sh
    bun install
    ```

## Development

To run the application in a local development environment:

```sh
bun run dev
```

This will start the Vite development server, and you can view the application by navigating to `http://localhost:3000` in your web browser. The page will automatically reload if you make changes to the source files.

## Building for Production

To create a production-ready build of the application:

```sh
bun run build
```

This command bundles the application into the `dist` directory, optimized for performance.

## Deployment

This project is configured for seamless deployment to the Cloudflare network.

### Deploy with Wrangler CLI

Ensure you have the [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed and configured.

To deploy the application, run the following command from the root of the project:

```sh
bun run deploy
```

This will build the application and deploy it to your Cloudflare account.

### Deploy with the Click of a Button

Alternatively, you can deploy this repository directly to Cloudflare.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/aaron-vigilante-marketing/generated-app-20250927-205435)

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.