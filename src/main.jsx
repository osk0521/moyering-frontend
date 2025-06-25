import React from 'react';
import App from './App.jsx';
import './index.css';
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <>  
    <App />
  </>
);

