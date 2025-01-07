SELECT 
    us.user_id,
    us.session_id,
    s.session_name,
    s.is_private
FROM 
    user_sessions_session us
JOIN 
    session s ON us.session_id = s.id
WHERE 
    s.is_private = true OR s.is_private = false;



SELECT * 
FROM
	message