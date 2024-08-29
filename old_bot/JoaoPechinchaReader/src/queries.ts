export const SELECT_MEMBER_ID_QUERY = 'SELECT id FROM members WHERE user_contact = $1';
export const INSERT_MEMBER_QUERY = 'INSERT INTO members VALUES ($1, $2, $3, $4, $5, $6, $7)';
export const SELECT_REQUEST_ID_QUERY = 'SELECT id FROM user_requests WHERE product_name = $1 AND member_id = $2';
export const INSERT_USER_REQUEST_QUERY = 'INSERT INTO user_requests VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
export const UPDATE_USER_REQUEST_STATUS_QUERY = 'UPDATE user_requests SET request_status = $1 WHERE member_id = $2 AND product_name = $3';