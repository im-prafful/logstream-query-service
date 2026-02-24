export const viewIncidents = (req, res) => {
    return res.status(200).json({ message: 'incidents fetched successfully' });
};

export const createIncident = (req, res) => {
    return res.status(201).json({ message: 'incident created successfully' });
};

export const deleteIncident = (req, res) => {
    return res.status(200).json({ message: 'incident deleted successfully' });
};