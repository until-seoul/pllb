import React from "react";
import {COLORS, MONO_FONT} from "../theme";

export type CitationProps = {
  readonly children: React.ReactNode;
  readonly align?: "left" | "right" | "center";
  readonly size?: number;
  readonly color?: string;
  readonly style?: React.CSSProperties;
};

/**
 * Chip sumber ilmiah. Tipografi mono kecil dengan garis atas — supaya referensi
 * terbaca sebagai catatan kaki ilmiah, bukan teks utama.
 */
export const Citation: React.FC<CitationProps> = ({
  children,
  align = "left",
  size = 17,
  color = COLORS.sandDim,
  style,
}) => (
  <div
    style={{
      display: "inline-block",
      borderTop: `1px solid ${color}55`,
      paddingTop: 8,
      fontFamily: MONO_FONT,
      fontSize: size,
      fontWeight: 400,
      letterSpacing: "0.06em",
      color,
      textAlign: align,
      lineHeight: 1.45,
      ...style,
    }}
  >
    {children}
  </div>
);

/**
 * Sumber inline di bawah sebuah angka atau stat — tanpa garis atas, supaya
 * menempel jelas pada data yang disitirnya.
 */
export const SourceTag: React.FC<{
  readonly children: React.ReactNode;
  readonly size?: number;
  readonly color?: string;
  readonly style?: React.CSSProperties;
}> = ({children, size = 14, color = COLORS.sandFaint, style}) => (
  <div
    style={{
      fontFamily: MONO_FONT,
      fontSize: size,
      fontWeight: 400,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color,
      lineHeight: 1.5,
      ...style,
    }}
  >
    {children}
  </div>
);
