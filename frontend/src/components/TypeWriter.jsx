import { useEffect, useState } from "react";

const Typewriter = (props) => {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const type = () => {
      setDisplayed(props.text.slice(0, i + 1));
      i++;
      if (i < props.text.length){
        const delay = 60 + Math.random() * 80;
        setTimeout(type, delay);
      }
    }
    type();
  }, [props.text]);

  return (
    <h1 className="typewriter-cursor text-5xl font-extrabold bg-gradient-to-l from-[#FFC107] via-[#FF6F00] via-[#FF7F50] to-primary bg-clip-text text-transparent">
        {displayed}
    </h1>
  );
}

export default Typewriter;