// theme.js — dark/light mode toggle, shared by every page.
// Pairs with the inline script in each page's <head> (which applies a
// saved preference immediately, before the page paints, so there's no
// flash of the wrong theme) and the CSS variables in site.css.

document.addEventListener("DOMContentLoaded", function () {
	var btn = document.querySelector(".theme-toggle");
	if (!btn) return;

	// One fixed icon (Font Awesome's circle-half-stroke, inlined as SVG
	// in each page's nav) represents the toggle itself rather than the
	// current state, so there's no icon or label to swap here — just
	// flip the theme.
	function isDark() {
		return document.documentElement.getAttribute("data-theme") === "dark";
	}

	btn.addEventListener("click", function () {
		var next = isDark() ? "light" : "dark";
		document.documentElement.setAttribute("data-theme", next);
		localStorage.setItem("theme", next);
	});
});
