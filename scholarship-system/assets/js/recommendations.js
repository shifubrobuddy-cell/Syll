/**
 * SCHOLARSHIP RECOMMENDATION SYSTEM
 * Recommendation Engine Frontend & Catalog Filtering
 * File: assets/js/recommendations.js
 */

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('scholarshipSearchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const courseFilter = document.getElementById('courseFilter');
    const cards = document.querySelectorAll('.scholarship-card-item');

    function applyFilters() {
        const searchTerm = (searchInput ? searchInput.value.toLowerCase().trim() : '');
        const selectedCat = (categoryFilter ? categoryFilter.value : 'ALL');
        const selectedCourse = (courseFilter ? courseFilter.value : 'ALL');

        cards.forEach(card => {
            const title = card.dataset.title?.toLowerCase() || '';
            const provider = card.dataset.provider?.toLowerCase() || '';
            const cat = card.dataset.category || 'ALL';
            const course = card.dataset.course || 'ALL';

            const matchesSearch = !searchTerm || title.includes(searchTerm) || provider.includes(searchTerm);
            const matchesCat = selectedCat === 'ALL' || cat === 'ALL' || cat.includes(selectedCat);
            const matchesCourse = selectedCourse === 'ALL' || course === 'ALL' || course.toLowerCase().includes(selectedCourse.toLowerCase());

            if (matchesSearch && matchesCat && matchesCourse) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
    if (courseFilter) courseFilter.addEventListener('change', applyFilters);
});
