// Initiation View Queries
module.exports = {
    picklistQuery: {
        $select: [
            "externalCode",
            "label_en_US"
        ].join(","),
        $orderby: "label_en_US",
        $top: 100
    }
}