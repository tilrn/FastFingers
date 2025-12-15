# Monkey Typer - Speed Typing Test

A modern, responsive React application for testing typing speed and accuracy. Built with beautiful UI/UX and real-time feedback.


https://github.com/user-attachments/assets/d386e008-afb8-4a01-a986-661a0e48c0ad




## Features

- **Real-time Typing Feedback**: Words are highlighted as you type them
- **Visual Word Tracking**: 
  - Grayed out completed words
  - Green highlighting for correct words
  - Red highlighting for incorrect words
  - Blue underline for current word
- **Speed Calculation**: Words per minute (WPM) calculation
- **Accuracy Tracking**: Percentage accuracy based on correct words
- **Error Counting**: Real-time error tracking
- **Timer**: 60-second countdown timer with visual progress bar
- **Multiple Sample Texts**: Random selection from various text samples
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Modern UI**: Beautiful gradient backgrounds and smooth animations

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## How to Use

1. **Start the Test**: Click "Start Test" or begin typing in the input field
2. **Type the Words**: Type each word and press space to move to the next word
3. **Monitor Progress**: Watch the timer countdown and see your real-time stats
4. **View Results**: After completion, see your WPM, accuracy, and error count
5. **Start New Test**: Click "New Test" to try again with a different text

## Features Explained

### Word Highlighting System
- **Current Word**: Blue underline indicates the word you should type next
- **Correct Words**: Green background for correctly typed words
- **Incorrect Words**: Red background with underline for mistakes
- **Completed Words**: Grayed out to show progress

### Statistics Tracking
- **WPM (Words Per Minute)**: Calculated based on time taken and words completed
- **Accuracy**: Percentage of correctly typed words
- **Errors**: Total number of incorrect words
- **Words Typed**: Number of words completed

### Timer System
- 60-second countdown timer
- Visual progress bar
- Color-coded warnings (yellow at 30s, red at 10s)
- Automatic test completion when time runs out

## Technology Stack

- **React 18** - Modern React with hooks
- **CSS3** - Custom styling with gradients and animations
- **JavaScript ES6+** - Modern JavaScript features
- **Create React App** - Zero-configuration build tool

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the [MIT License](LICENSE). 
