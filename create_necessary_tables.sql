

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
	addtional_info varchar(255) NULL,
	CONSTRAINT fk_member FOREIGN KEY (member_id) REFERENCES members(id),
	CONSTRAINT user_requests_pkey PRIMARY KEY (id)
);


CREATE TABLE public.products (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	p_name varchar(255) NULL,
	classification varchar(255) NULL,
	message varchar(255) NULL,
	url varchar(255) NULL,
	coupouns varchar(255) NULL,
	price varchar(255)NULL,
	CONSTRAINT products_pkey PRIMARY KEY (id)
);


----------

CREATE TABLE public.members (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	user_ddd varchar(255) NULL,
	user_number varchar(255) NULL,
	user_contact varchar(255) NULL,
	user_name varchar(255) NULL,
	product_value numeric NULL,
	CONSTRAINT members_pkey PRIMARY KEY (id)
);

CREATE TABLE public.products (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	product_name varchar(255) NULL,
	product_classification varchar(255) NULL,
	product_message varchar(1000) NULL,
	product_url varchar(255) NULL,
	coupouns varchar(255) NULL,
	price varchar(255) NULL,
	CONSTRAINT products_pkey PRIMARY KEY (id)
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
	addtional_info varchar(255) NULL,
	CONSTRAINT user_requests_pkey PRIMARY KEY (id),
	CONSTRAINT fk_member FOREIGN KEY (member_id) REFERENCES public.members(id)
);