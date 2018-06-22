import React from 'react';

export default function ChildComponent(props) {
  const handleClick = e => props.changeColor(e.target.value);

  return (
    <div className="child-component">
      <h4>Child Component</h4>

      <button value="Red" onClick={handleClick}>
        Red
      </button>

      <button value="Blue" onClick={handleClick}>
        Blue
      </button>

      <button value="White" onClick={handleClick}>
        White
      </button>
    </div>
  );
}