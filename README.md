# Money Manager Frontend

A modern, responsive web application for managing personal finances built with React and Tailwind CSS.

## Features

### 🎯 Core Features
- **Dashboard with Analytics**
  - Monthly, Weekly, and Yearly income/expense overview
  - Interactive charts (Bar chart for monthly trends, Pie chart for category breakdown)
  - Summary cards showing total income, expense, and balance
  
- **Transaction Management**
  - Add income, expense, and transfer transactions
  - Beautiful modal interface with tabs
  - Category selection with icons
  - Division tracking (Office/Personal)
  - Multiple account support

- **Transaction History**
  - View all transactions in a clean table format
  - Edit transactions within 12 hours
  - Delete transactions within 12 hours
  - Visual indicators for editable transactions

- **Advanced Filtering**
  - Filter by transaction type (Income/Expense/Transfer)
  - Filter by category
  - Filter by division (Office/Personal)
  - Filter by account
  - Date range filtering

- **Responsive Design**
  - Mobile-friendly interface
  - Works seamlessly on all devices
  - Touch-optimized controls

## Tech Stack

- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Axios** - API communication
- **Lucide React** - Icons
- **date-fns** - Date formatting

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd money-manager-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure your API URL in `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```
or for production:
```
REACT_APP_API_URL=https://your-backend-url.com/api
```

5. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Project Structure

```
src/
├── components/
│   ├── Dashboard.js           # Main dashboard with charts
│   ├── TransactionModal.js    # Add/Edit transaction modal
│   ├── TransactionHistory.js  # Transaction list view
│   └── Filters.js            # Filter component
├── services/
│   └── api.js                # API service layer
├── utils/
│   └── constants.js          # Constants and helper functions
├── App.js                    # Main app component
├── index.js                  # Entry point
└── index.css                 # Global styles
```

## Key Components

### Dashboard
- Displays summary cards (Income, Expense, Balance)
- Monthly bar chart comparing income vs expense
- Pie chart for expense category breakdown
- Category-wise expense list

### Transaction Modal
- Tabbed interface for Income/Expense/Transfer
- Category selection with visual icons
- Division selector (Office/Personal)
- Account selection
- Date and time picker
- Form validation

### Transaction History
- Table view of all transactions
- Edit/Delete actions (within 12 hours)
- Timer showing remaining edit time
- Visual status indicators

### Filters
- Collapsible filter panel
- Multiple filter options
- Clear all filters button
- Active filter indicator

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts and add environment variables

### Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy the `build` folder to Netlify

3. Set environment variables in Netlify dashboard

### Other Platforms

The build folder can be deployed to any static hosting service:
- AWS S3 + CloudFront
- Firebase Hosting
- GitHub Pages
- Render

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| REACT_APP_API_URL | Backend API URL | http://localhost:5000/api |

## Features Walkthrough

### Adding a Transaction

1. Click the floating `+` button
2. Select transaction type (Income/Expense/Transfer)
3. Enter amount
4. Select category from visual grid
5. Choose division (Office/Personal)
6. Select account
7. Add description
8. Set date and time
9. Click "Add Transaction"

### Viewing Dashboard

1. Click "Dashboard" in navigation
2. Select period (Week/Month/Year)
3. View summary cards
4. Analyze charts
5. Review category breakdown

### Filtering Transactions

1. Go to "History" tab
2. Click "Filters" button
3. Select desired filters
4. Transactions update automatically
5. Click "Clear All" to reset

### Editing Transactions

1. Find transaction in history (must be within 12 hours)
2. Click edit icon
3. Modify details in modal
4. Click "Update Transaction"

## Customization

### Adding New Categories

Edit `src/utils/constants.js`:

```javascript
export const EXPENSE_CATEGORIES = [
  // ... existing categories
  { value: 'new-category', label: 'New Category', icon: '🎯' },
];
```

### Changing Theme Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // your custom colors
      }
    }
  }
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimization

- Code splitting enabled
- Lazy loading for components
- Optimized re-renders
- Efficient API calls
- Cached data where possible

## Troubleshooting

### API Connection Issues
- Check if backend is running
- Verify REACT_APP_API_URL is correct
- Check for CORS issues

### Build Errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`

## License

MIT

## Support

For issues and questions, please create an issue in the GitHub repository.
