import './App.css';
import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import MainPage from './pages/main-page';

export default function App() {
  return <MantineProvider><MainPage/></MantineProvider>;
}