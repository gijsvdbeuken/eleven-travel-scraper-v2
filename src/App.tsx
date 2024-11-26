//import { useState } from "react";
import './App.css';
import ExecuteForm from './components/ExecuteForm';
import TargetForm from './components/TargetForm';

function App() {
  return (
    <div className="min-w-500">
      <TargetForm />
      <ExecuteForm />
    </div>
  );
}

export default App;
