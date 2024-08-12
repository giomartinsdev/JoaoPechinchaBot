

CREATE TABLE public.members (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	user_ddd varchar(255) NULL,
	user_number varchar(255) NULL,
	user_contact varchar(255) NULL,
	user_name varchar(255) NULL,
	product_value numeric null,
	PRIMARY KEY (id)
);



CREATE TABLE public.user_requests (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	product_name varchar(255) NULL,
	product_classification varchar(255) NULL,
	product_value numeric NULL,
	member_id uuid NOT NULL,
	request_status varchar(255) NULL,
	additional_information _text NULL,
	CONSTRAINT fk_member FOREIGN KEY (member_id) REFERENCES members(id),
	CONSTRAINT user_requests_pkey PRIMARY KEY (id)
);
