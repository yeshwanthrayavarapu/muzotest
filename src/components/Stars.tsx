import { memo, useState } from "react";

interface Props {
  setStarsAction: (stars: number) => void;
}

export const Stars = memo(function ({ setStarsAction }: Props) {
  const [stars, setStars] = useState(1);
  const [hover, setHover] = useState(1);

  const col = (i: number) => {
    if (i <= stars) {
      return "text-accent";
    } else if (i <= hover) {
      return "text-altAccent";
    }

    return "text-subContainer";
  };

  return [1, 2, 3, 4, 5].map((i) => (
    <span
      key={i}
      onClick={() => {
        setStars(i);
        setStarsAction(i);
      }}
      onMouseEnter={() => setHover(i)}
      onMouseLeave={() => setHover(0)}
      className={`cursor-pointer text-3xl star ${col(i)} hover:scale-110`}
      style={{ transition: "transform 0.2s ease" }}
    >
      ★
    </span>
  ));
});
