// parallax.js — hero background parallax, shared by every page.
//
// Each .hero on the site now has a .hero-bg layer inside it (see the
// HERO section of site.css) that's taller than the hero box itself,
// with the hero box clipping it via overflow: hidden. This script
// nudges every .hero-bg up and down as the page scrolls, but by less
// than the page itself scrolls — so the image appears to drift
// slower than the page moving over it, instead of scrolling at the
// same speed (which would look like no effect at all) or staying
// completely still (which is what background-attachment: fixed does).

document.addEventListener("DOMContentLoaded", function () {
	var layers = document.querySelectorAll(".hero-bg");
	if (!layers.length) return;

	// Respect the OS-level "reduce motion" setting: leave every layer
	// at its default position and never attach the scroll listener.
	var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	if (reduced) return;

	// How much slower the image moves than the page. 0 = pinned like
	// background-attachment: fixed; 1 = moves exactly with the page
	// (no visible effect). 0.35 is a middle ground that reads clearly
	// without feeling extreme.
	var FACTOR = 0.35;

	// hero is the positioned ancestor .hero-bg fills, so its own
	// scroll position tells us how far each layer should have moved.
	var heroes = [];
	layers.forEach(function (layer) {
		heroes.push({ hero: layer.parentElement, layer: layer });
	});

	var ticking = false;

	function update() {
		heroes.forEach(function (pair) {
			// getBoundingClientRect().top is the hero's distance from the
			// top of the viewport — 0 when its top edge is at the top of
			// the screen, negative once you've scrolled past it. We only
			// care about that negative (scrolled-past) distance.
			var scrolledPast = Math.max(0, -pair.hero.getBoundingClientRect().top);
			pair.layer.style.transform = "translateY(" + scrolledPast * FACTOR + "px)";
		});
		ticking = false;
	}

	// Scroll events can fire dozens of times per second — far more
	// often than the screen actually repaints. Wrapping the update in
	// requestAnimationFrame collapses all of those down to at most one
	// update per frame, so the page never does wasted work between
	// repaints.
	function onScroll() {
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(update);
	}

	window.addEventListener("scroll", onScroll, { passive: true });
	update();
});
