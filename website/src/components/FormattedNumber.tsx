const formatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 2,
});

export const FormattedNumber = ({
  children,
  noColor = false,
}: {
  children: number | string;
  noColor?: boolean;
}) => {
  if (typeof children !== "number") {
    return children;
  }

  const className =
    noColor || children === 0
      ? ""
      : children > 0
      ? "text-green-600"
      : "text-red-600";

  return <span className={className}>{formatter.format(children)}</span>;
};
