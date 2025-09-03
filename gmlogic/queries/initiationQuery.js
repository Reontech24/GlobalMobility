// Initiation View Queries
export const EmployeeName = {
    $select: [
        "userId",
        "country",
        "custom04",
        "custom06",
        "custom10",
        "department",
        "displayName",
        "hireDate",
        "title",
        "personKeyNav/personIdExternal"
    ].join(","),
    "$expand": "personKeyNav",
    "$orderby": "displayName"
}