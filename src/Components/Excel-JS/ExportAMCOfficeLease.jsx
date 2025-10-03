import * as XLSX from "xlsx";

const ExportAMCOfficeLease = (data, fileName) => {
    console.log(data,"data")
    const headers = [
        "ID",
        "Name of Property",
        "Address",
        "Property Type",
        "Entity",
        "Tenure Of Agreement Start Date",
        "Tenure Of Agreement End Date",
        "Rent Free",
        "Lock In Period Start Date",
        "Lock In Period End Date",
        "Notice Period",
        "Usable Area",
        "Chargable Area",
        "Efficiency",
        "Renewal Term",
        "Deposit Amount",
        "Parking",
        "Maintenance/Property Taxes",
        "Responsibility",
        "Rent From Date",
        "Rent To Date",
        "Rent Per Month",
        "Rate Per Sq. Ft",
        "Escalation",
        "CAM Per Month",
        "CAM Rate Per Sq. Ft",
        "CAM Escalation",
    ];

    // Prepare the data
    const transformedData = data.flatMap((item) => {
        if (item.rentDetails && Array.isArray(item.rentDetails)) {
            return item.rentDetails.map((rent) => [
                item.ID,
                item["Name of Property"],
                item["Address"],
                item["Property Type"],
                item["Entity"],
                item["Tenure Of Agreement Start Date"],
                item["Tenure Of Agreement End Date"],
                item["Rent Free"],
                item["Lock In Period Start Date"],
                item["Lock In Period End Date"],
                item["Notice Period"],
                item["Usable Area"],
                item["Chargable Area"],
                item["Efficiency"],
                item["Renewal Term"],
                item["Deposit Amount"],
                item["Parking"],
                item["Maintenance/Property taxes"],
                item["Responsibility"],
                rent["From Date"] || "",
                rent["To Date"] || "",
                rent["Rent Per Month"] || "",
                rent["Rate Per Sq, Ft"] || "",
                rent["Escalation"] || "",
                rent["CAM Per Month"] || "",
                rent["CAM Rate Per Sq. Ft"] || "",
                rent["CAM Escalation"] || "",
            ]);
        } else {
            return [
                [
                    item.ID,
                    item["Name of Property"],
                    item["Address"],
                    item["Property Type"],
                    item["Entity"],
                    item["Tenure Of Agreement Start Date"],
                    item["Tenure Of Agreement End Date"],
                    item["Rent Free"],
                    item["Lock In Period Start Date"],
                    item["Lock In Period End Date"],
                    item["Notice Period"],
                    item["Usable Area"],
                    item["Chargable Area"],
                    item["Efficiency"],
                    item["Renewal Term"],
                    item["Deposit Amount"],
                    item["Parking"],
                    item["Maintenance/Property taxes"],
                    item["Responsibility"],
                    "", // Rent From Date
                    "", // Rent To Date
                    "", // Rent Per Month
                    "", // Rate Per Sq. Ft
                    "", // Escalation
                    "", // CAM Per Month
                    "", // CAM Rate Per Sq. Ft
                    "", // CAM Escalation
                ],
            ];
        }
    });

    // Combine headers and data
    const finalData = [headers, ...transformedData];
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(finalData);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Office Lease");
    // Write file and trigger download
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export default ExportAMCOfficeLease;