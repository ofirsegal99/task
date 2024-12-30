
export function validatePagination(currentPage: string | undefined, viewsPerPage: string | undefined, views: number | undefined): {currentPage: number, viewsPerPage: number} {
   return useValidation(currentPage, viewsPerPage, views);
}


function useValidation(currentPage: string | undefined, viewsPerPage: string | undefined, views: number | undefined): {currentPage: number, viewsPerPage: number}{
    if(Number(currentPage) && Number(viewsPerPage) && Number(views)){
          const validViewsPerPageOptions = [3, 5, 10, 20];
          const isViewsPerPageIncludedAsValidOption = validViewsPerPageOptions.includes(Number(viewsPerPage));
          const isCurrentPageAPossiblePage = Number(currentPage) <= (Math.ceil(Number(views)/Number(viewsPerPage)));
          if (isCurrentPageAPossiblePage && isViewsPerPageIncludedAsValidOption)  return {currentPage: Number(currentPage), viewsPerPage: Number(viewsPerPage)};
    }
    return {currentPage: 1, viewsPerPage:5};
}