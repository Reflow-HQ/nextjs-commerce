import clsx from "clsx";
import { Currency } from "lib/reflow/types";

const Price = ({
  amount,
  className,
  currency,
  currencyCodeClassName,
}: {
  amount: number;
  className?: string;
  currency: Currency;
  currencyCodeClassName?: string;
} & React.ComponentProps<"p">) => {
  let fractionDigits = 0;

  if (!currency.zero_decimal) {
    // Currencies with cents are kept in the smallest unit ($12.34 is 1234 in the DB)
    // Divide by 100 to get the proper float value.
    // For currencies without decimals, the money is already the correct int value.
    amount = amount / 100;
    fractionDigits = 2;
  }

  return (
    <p suppressHydrationWarning={true} className={className}>
      {`${new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currency.code,
        currencyDisplay: "narrowSymbol",
        maximumFractionDigits: fractionDigits,
      }).format(amount)}`}
      <span
        className={clsx("ml-1 inline", currencyCodeClassName)}
      >{`${currency.code}`}</span>
    </p>
  );
};

export default Price;
