import type { Metadata } from "next";

import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Orders | Zia Goods & Carriage Contractor",
  description:
    "A client portal for placing and reviewing haulage orders with Zia Goods. In development — until it opens, orders are placed by telephone or through the enquiry form.",
  alternates: { canonical: "/orders" },
  /* Nothing to index on a page that describes a product which does not
     exist yet. */
  robots: { index: false, follow: true },
};

export default function Orders() {
  return (
    <ComingSoon
      eyebrow="Client portal"
      title="Orders"
      lede="A place to raise a consignment, see what has been accepted against your contracted capacity, and keep the paperwork for a run in one thread rather than across a phone and an inbox."
      points={[
        "Raise a consignment against an existing contract or as a spot load",
        "See what has been accepted, what is scheduled, and what is still open",
        "Keep weighbridge readings and delivery paperwork with the run they belong to",
      ]}
      footnote="Until this opens, orders are placed by telephone or through the enquiry form"
    />
  );
}
