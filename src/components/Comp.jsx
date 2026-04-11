import react from 'react';          // Import React library so we can create React components
import '../styles/Comp.css';        // Import a CSS file for styling the component

function Comp() {                   // Define a functional component named Comp
    return (                        // The component returns JSX, which is a syntax extension for JavaScript that looks similar to HTML
                                    // <> </> is a react fragment - lets us group multiple elements without adding a extra div
        <>
            <button> Text </button>        { /* A simple button element with the text "Text" */ }
            <button className='MyRandomAbritaryUselessClass'> Text </button>    {/* Another button, but this one has a CSS class applied */} {/* className is used instead of "class" in React */}
        </>
    );
}

export default Comp; // Export the Comp component so other files can import and use it

//This file is just for refernece purposes - not used in final project