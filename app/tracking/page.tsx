import type { Metadata } from "next";

import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Assigned vehicle tracking | Zia Goods & Carriage Contractor",
  description:
    "A client portal for following the vehicles assigned to your consignments. In development — until it opens, the tracking department reports on every run by telephone.",
  alternates: { canonical: "/tracking" },
  robots: { index: false, follow: true },
};

export default function Tracking() {
  return (
    <ComingSoon
      eyebrow="Client portal"
      title="Assigned vehicle tracking"
      lede="A view of the vehicles carrying your consignments: which ones are assigned, where they are against the route as planned, and what the tracking department found on its last check."
      points={[
        "The vehicles assigned to your consignments, and the route each is running",
        "Progress against the run as it was scheduled, not against an estimate",
        "What the four daily driver checks reported, in the order they happened",
      ]}
      footnote="Until this opens, the tracking department reports on every run by telephone"
    />
  );
}
