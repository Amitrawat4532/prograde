import { ActionDialog } from "@/components/ui/ActionDialog";
import { formatPrice } from "@/lib/site";

type Props = {
  item: string;
  price: number;
  checkoutUrl: string | null;
  label?: string;
  className?: string;
  kind?: "order" | "course";
};

/**
 * Goes straight to a hosted checkout when one is configured for the product;
 * otherwise opens a short order request (delivered by email / webhook / DM).
 */
export function BuyButton({ item, price, checkoutUrl, label = "Buy LUT", className = "btn btn-amber", kind = "order" }: Props) {
  const content = (
    <>
      {label} <span className="arrow" aria-hidden>→</span>
    </>
  );

  if (checkoutUrl) {
    return (
      <a href={checkoutUrl} className={className} data-cursor="Buy" target="_blank" rel="noopener">
        {content}
      </a>
    );
  }

  return (
    <ActionDialog
      label={content}
      className={className}
      cursor="Buy"
      kind={kind}
      variant="order"
      item={item}
      price={formatPrice(price)}
      title={kind === "course" ? "Reserve your seat" : "Get the pack"}
      submitLabel={kind === "course" ? "Reserve my seat" : "Send order"}
      intro={
        <div className="flex items-baseline justify-between gap-6 border-y border-line py-4">
          <span className="text-lg font-medium text-ink">{item}</span>
          <span className="meta text-amber">{formatPrice(price)}</span>
        </div>
      }
    />
  );
}
