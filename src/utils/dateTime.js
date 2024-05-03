function formatDate(datetimeString) {
    if (!datetimeString) {
        return 'April 69, 2024';
    
    }
    const date = new Date(datetimeString);
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

export { formatDate };