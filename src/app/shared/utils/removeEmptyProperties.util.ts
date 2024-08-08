export default function removeEmptyProperties(obj: any) {
    const result: any = {};
    Object.keys(obj).forEach((key: string) => {
        if (typeof obj[key] === "object" && obj[key] !== null) {
            const res = removeEmptyProperties(obj[key]);
            if (Object.keys(res).length > 0) {
                result[key] = res;
            }
        } else if (obj[key] !== null && obj[key] !== undefined) {
            result[key] = obj[key];
        }
    });
    return result;
}
