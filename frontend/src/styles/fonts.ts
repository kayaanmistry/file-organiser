import "@fontsource-variable/geist-mono";

const fonts = {
  "--font-mono": "'Geist Mono Variable', ui-monospace, Consolas, monospace",
};

for (const [name, value] of Object.entries(fonts)) {
  document.documentElement.style.setProperty(name, value);
}
