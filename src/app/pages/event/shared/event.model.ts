export const SORTING_OPTIONS = [
    {
        id: 0,
        name: 'Start time',
        value: 'beginDateYear,beginDateMonth,beginDateDay'
    },
    {
        id: 1,
        name: 'End time',
        value: 'endDateYear,endDateMonth,endDateDay'
    },
    {
        id: 2,
        name: 'Last edit',
        value: 'lastUpdated'
    },
    {
        id: 3,
        name: 'Alphabetical order',
        value: 'name'
    }
];

export class EventFilterQuery {
    name: number;

    beginDateYear: number;
    beginDateMonth: number;
    beginDateDay: number;

    endDateYear: number;
    endDateMonth: number;
    endDateDay: number;

    sort: string;
    page: number;
    size: number;

    objectifyQuery(): any {
        return {
            "name:co": this.name,
            "beginDateYear": this.beginDateYear,
            "beginDateMonth": this.beginDateMonth,
            "beginDateDay": this.beginDateDay,
            "endDateYear": this.endDateYear,
            "endDateMonth": this.endDateMonth,
            "endDateDay": this.endDateDay,
            "sort": this.sort,
            "page": this.page,
            "size": this.size
        };
    }
};

export class PaginationInformation {
    currentPage: number;
    numberOfPages: number;
    pageSize: number;
    numberOfRecords: number;

    constructor() {
        this.currentPage = 1;
        this.pageSize = 10;
    }
};