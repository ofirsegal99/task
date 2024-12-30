import { defineStore } from "pinia";
import { watch } from "vue"; // Import watch from Vue

export const usePaginationStore = defineStore('pagination', {
    state: () => ({
        currentPage: 1,
        viewsPerPage: 10,
        views: 0 as number,
        totalPages: 0 as number,
    }),
    actions: {
        initializeStore(views: number) {
            this.views = views;
            this.calculateTotalPages(); // Calculate total pages on initialization

            // Watch for changes in viewsPerPage
            watch(() => this.viewsPerPage, () => {
                this.calculateTotalPages();
            });
        },
        calculateTotalPages() {
            this.totalPages = Math.ceil(this.views / this.viewsPerPage);
        },
        setPagination(page: number, views: number) {
            this.currentPage = page;
            this.viewsPerPage = views;
            this.calculateTotalPages(); // Recalculate total pages when setting pagination
        },
        setViewsPerPage(views: number){
            this.viewsPerPage = views;
            this.calculateTotalPages();
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        previousPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        setPage(page: number) {
            this.currentPage = page;
        }
    },
    getters: {
        paginationInfo(state) {
            const pagesToShow = 5; // Total number of pages to show
            let startPage = Math.max(1, state.currentPage - 2);
            let endPage = Math.min(state.totalPages, state.currentPage + 2);
            const pagesArray = [];

            // Adjust the start and end to ensure we always show 5 pages
            if (endPage - startPage < pagesToShow - 1) {
                if (endPage === state.totalPages) {
                    startPage = Math.max(1, endPage - pagesToShow + 1);
                } else if (startPage === 1) {
                    endPage = Math.min(state.totalPages, startPage + pagesToShow - 1);
                }
            }

            // Fill the pages array
            for (let i = startPage; i <= endPage; i++) {
                pagesArray.push(i);
            }
            let maxResults = ((this.viewsPerPage * this.currentPage) > this.views) ? this.views : (this.viewsPerPage * this.currentPage);
            let viewsShowcase = `Showing ${1 + (this.viewsPerPage * (this.currentPage - 1))} out of ${maxResults} results`;

            return {
                startOfPage: startPage > 1 ? 1 : null,
                pages: pagesArray,
                endOfPage: endPage < state.totalPages ? state.totalPages : null,
                viewsShowcase: viewsShowcase
            };
        },
        getMinimumAndMaximumViewPerPage(state): { minViewsPerPage: number; maxViewsPerPage: number } {
            let maxResults = Math.min(this.views, this.viewsPerPage * this.currentPage);
            return {
                maxViewsPerPage: maxResults,
                minViewsPerPage: 1 + (this.viewsPerPage * (this.currentPage - 1)),
            };
        },
    }
});
