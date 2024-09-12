# Series Chart with Filters (React + TypeScript)

![ComboChart](https://github.com/user-attachments/assets/47ae2993-73e9-4a86-8c5e-fb6dddf64c39)


This React + TypeScript application demonstrates how to create a charting component that allows users to select metrics and filters using the Sisense Compose SDK. The component pulls data from a Sisense instance, displays KPIs, and visualizes data in a line chart, dynamically updating based on user-selected filters.

## Features

- **Interactive KPIs**: Display dynamic values for revenue, cost, and sales items.
- **Customizable Metrics**: Users can select main and additional metrics from predefined options.
- **Filters**: Apply filters based on demographic and product conditions like age range, gender, and condition.
- **Date Range Picker**: Filter data within a custom date range.
- **Responsive Line Chart**: Visualize filtered data through a customizable line chart.

## Dependencies

The project relies on the following dependencies:

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Material-UI (MUI)**: A popular React UI framework for styling components.
- **Sisense Compose SDK**: Used to interact with the Sisense backend for querying data and rendering visualizations.

## Installation Guide

### Prerequisites

- **Node.js** (v14 or later)
- **npm** (v6 or later) or **yarn**
- A **Sisense Compose SDK** account (you can sign up for a free trial [here](https://www.sisense.com/platform/compose-sdk-free-trial/)).

### Installation Steps

1. **Clone the repository**:

   ```bash
   git clone <your-repository-url>
   ```

2. **Navigate to the project directory**:

   ```bash
   cd <your-project-directory>
   ```

3. **Install the dependencies**:

   Run the following command to install all necessary packages:

   ```bash
   npm install
   ```

   or, if you're using yarn:

   ```bash
   yarn install
   ```

### Running the Application

1. **Start the development server**:

   ```bash
   npm start
   ```

   or with yarn:

   ```bash
   yarn start
   ```

2. The app will run on `http://localhost:3000` by default.

## Sisense Authentication Configuration

To authenticate requests from the Sisense SDK, you need to provide your Sisense instance URL and API token in the context provider.

1. **Locate the `index.tsx` file** in the root of the `src` directory.
   
2. **Update the `SisenseContextProvider`** with your Sisense instance details:

   ```tsx
   <SisenseContextProvider
      url="https://YOUR_SISENSE_INSTANCE_URL" // Replace with your Sisense instance URL
      token="YOUR_API_TOKEN"  // Replace with your Sisense API token
   >
     <App />
   </SisenseContextProvider>
   ```

   If you're not a Sisense customer, you can request a free API token by signing up for the Sisense Compose SDK trial [here](https://www.sisense.com/platform/compose-sdk-free-trial/).

## Project Structure

```bash
├── src
│   ├── App.tsx         # Main app component
│   ├── components      # Reusable components
│   ├── index.tsx       # Entry point, Sisense context provider is set here
│   ├── sample-ecommerce.ts  # Data model file for the app
│   └── ...
├── package.json        # Project dependencies
└── tsconfig.json       # TypeScript configuration
```

## Key Files

- **`index.tsx`**: Sets up the Sisense context provider for the entire app.
- **`App.tsx`**: The main component that contains the charting and filtering logic.
- **`sample-ecommerce.ts`**: Contains the data model definitions for the commerce metrics.

## Troubleshooting

1. **API Token Issues**: Ensure that your API token is valid and not expired. If you encounter authentication issues, verify that your token is correctly set in the `SisenseContextProvider`.

2. **Sisense Instance URL**: Make sure that the URL to your Sisense instance is accurate and accessible from your environment.

3. **Filter Data Not Loading**: If the filters are not loading, verify the dimensions and measures defined in `sample-ecommerce.ts` match the schema of your Sisense instance.

## Available Scripts

In the project directory, you can run:

- `npm start` - Runs the app in the development mode.
- `npm run build` - Builds the app for production.
- `npm test` - Launches the test runner.

## License

This project is licensed under the MIT License.

## Learn More

To learn more about the Sisense Compose SDK, visit the [official documentation](https://sisense.dev/).
