import { memo, useState } from "react";

interface Props {
  setStarsAction: (stars: number) => void;
}

export const Stars = memo(function ({ setStarsAction }: Props) {
  const [stars, setStars] = useState(1);
  const [hover, setHover] = useState(1);

  const col = (i: number) => {
    if (i < stars) {
      return "text-cyan-400";
    } else if (i < hover) {
      return "text-blue-500";
    }

    return "text-gray-300";
  };

  return [0, 1, 2, 3, 4].map((i) => (
    <span
      key={i}
      onClick={() => {
        setStars(i + 1);
        setStarsAction(i + 1);
      }}
      onMouseEnter={() => setHover(i + 1)}
      onMouseLeave={() => setHover(0)}
      className={`cursor-pointer text-3xl star ${col(i)} hover:scale-110`}
      style={{ transition: "transform 0.2s ease" }}
    >
      ★
    </span>
  ));
});
