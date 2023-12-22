import React from "react";

interface PaginationProps {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    itemsLength: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({currentPage, itemsPerPage, totalItems, onPageChange, itemsLength}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const getPageRange = () => {
        const visiblePages = 3;
        if (totalPages <= visiblePages) {
            return Array.from({length: totalPages}, (_, index) => index + 1);
        } else if (currentPage <= (visiblePages - 1)) {
            return [1, 2, 3, ">", ">>"];
        } else if (currentPage > totalPages - (visiblePages - 1)) {
            return ["<<", "<", totalPages - 2, totalPages - 1, totalPages];
        } else if (itemsPerPage < itemsLength) {
            return ["<<", "<", currentPage - 2, currentPage - 1, currentPage];
        } else {
            return ["<<", "<", currentPage - 1, currentPage, currentPage + 1, ">", ">>"];
        }
    };
    return (
        <nav aria-label="Pagination">
            <ul className="pagination">
                {getPageRange().map((page, key) => (
                    <li
                        key={key}
                        className={`page-item ${page === currentPage ? "active" : ""}`}
                        onClick={() => {
                            if (typeof page === "number") {
                                onPageChange(page);
                            } else if (page === ">" && currentPage < totalPages) {
                                onPageChange(currentPage + 1);
                            } else if (page === "<" && currentPage > 1) {
                                onPageChange(currentPage - 1);
                            } else if (page === ">>" && currentPage < totalPages) {
                                onPageChange(totalPages);
                            } else if (page === "<<" && currentPage > 1) {
                                onPageChange(1);
                            }
                        }}
                    >
                        <button className="page-link">{page}</button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Pagination;