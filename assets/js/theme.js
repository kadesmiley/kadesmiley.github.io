// theme.js — dark/light mode toggle, shared by every page.
// Pairs with the inline script in each page's <head> (which applies a
// saved preference immediately, before the page paints, so there's no
// flash of the wrong theme) and the CSS variables in site.css.

document.addEventListener("DOMContentLoaded", function () {
	var btn = document.querySelector(".theme-toggle");
	if (!btn) return;

	function isDark() {
		return document.documentElement.getAttribute("data-theme") === "dark";
	}

	function updateIcon() {
		btn.textContent = isDark() ? "☀️" : "🌙";
		btn.setAttribute(
			"aria-label",
			isDark() ? "Switch to light mode" : "Switch to dark mode"
		);
	}

	btn.addEventListener("click", function () {
		var next = isDark() ? "light" : "dark";
		document.documentElement.setAttribute("data-theme", next);
		localStorage.setItem("theme", next);
		updateIcon();
	});

	updateIcon();
});
