import { formatTimeAgo } from "@/utils/dateFormat";
import Link from "next/link";
import { useEffect, useState } from "react";

export const Footer = ({ pricesLastUpdated }: { pricesLastUpdated?: Date }) => {
  // Re-render every second to update the relative date
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCount(count + 1), 1000);
    return () => clearInterval(interval);
  });

  return (
    <footer className="mb-24">
      <p>
        Each item&apos;s expected value is calculated based on its drop chance
        multiplied by its profit. The sum of all profitable items&apos; expected
        values creates a loot chest&apos;s average expected value per run.
      </p>
      <p>
        Expected value after rerolling is calculated by subtracting the value of
        a kismet feather from the expected value of the chest.
      </p>
      <p>
        The mechanics behind chest loot are not completely known, so the
        expected value is only an rough estimate. It also does not take RNG
        meter into account.
      </p>
      <p>
        {pricesLastUpdated ? (
          <>
            Prices last updated{" "}
            <span title={pricesLastUpdated.toLocaleString()}>
              {formatTimeAgo(pricesLastUpdated)}
            </span>
            .
          </>
        ) : null}{" "}
        Data sourced from{" "}
        <Link href="https://github.com/Tricked-dev/lowestbins">
          Tricked&apos;s <code>lowestbins</code>
        </Link>
        .
      </p>
      <p>
        Drop chances sourced from the{" "}
        <Link href="https://wiki.hypixel.net/Main_Page">
          Hypixel SkyBlock Wiki
        </Link>
        .
      </p>
    </footer>
  );
};
