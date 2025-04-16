CREATE TABLE "public"."course" (
  "course_id" int4 NOT NULL DEFAULT nextval('course_course_id_seq'::regclass),
  "course_code" varchar(20) COLLATE "pg_catalog"."default" NOT NULL,
  "title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "semester" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "instructor_id" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  CONSTRAINT "course_pkey" PRIMARY KEY ("course_id", "instructor_id"),
  CONSTRAINT "fk_course_useraccount_1" FOREIGN KEY ("instructor_id") REFERENCES "public"."useraccount" ("user_id"),
  CONSTRAINT "course_course_code_key" UNIQUE ("course_code")
)
;

ALTER TABLE "public"."course"
  OWNER TO "default-admin";


  CREATE TABLE "public"."syllabus" (
    "syllabus_id" int4 NOT NULL DEFAULT nextval('syllabus_syllabus_id_seq'::regclass),
    "course_id" int4 NOT NULL,
    "title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
    "version" varchar(20) COLLATE "pg_catalog"."default",
    "upload_date" date NOT NULL,
    "path" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
    CONSTRAINT "syllabus_pkey" PRIMARY KEY ("syllabus_id"),
    CONSTRAINT "syllabus_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."course" ("course_id") ON DELETE NO ACTION ON UPDATE NO ACTION
  )
  ;

  ALTER TABLE "public"."syllabus"
    OWNER TO "default-admin";

    CREATE TABLE "public"."document" (
      "document_id" int4 NOT NULL DEFAULT nextval('document_document_id_seq'::regclass),
      "syllabus_id" int4 NOT NULL,
      "uploaded_by" int4 NOT NULL,
      "title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
      "file_type" varchar(50) COLLATE "pg_catalog"."default",
      "upload_date" date NOT NULL,
      "path" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
      "tag_id" int4,
      CONSTRAINT "document_pkey" PRIMARY KEY ("document_id"),
      CONSTRAINT "document_syllabus_id_fkey" FOREIGN KEY ("syllabus_id") REFERENCES "public"."syllabus" ("syllabus_id") ON DELETE NO ACTION ON UPDATE NO ACTION,
      CONSTRAINT "document_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "public"."useraccount" ("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION,
      CONSTRAINT "fk_document_Tags_3" FOREIGN KEY ("tag_id") REFERENCES "public"."Tags" ("tag_id"),
      CONSTRAINT "document_file_type_check" CHECK (file_type::text = ANY (ARRAY['pdf'::character varying, 'docx'::character varying, 'txt'::character varying, 'html'::character varying]::text[]))
    )
    ;

    ALTER TABLE "public"."document"
      OWNER TO "default-admin";

      CREATE TABLE "public"."Tags" (
        "tag_id" int4 NOT NULL,
        "Title" varchar(255),
        PRIMARY KEY ("tag_id")
      )
      ;

      CREATE TABLE "public"."useraccount" (
        "user_id" int4 NOT NULL DEFAULT nextval('useraccount_user_id_seq'::regclass),
        "email" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
        "full_name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
        "role" varchar(20) COLLATE "pg_catalog"."default" NOT NULL,
        "password_hash" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
        "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "useraccount_pkey" PRIMARY KEY ("user_id"),
        CONSTRAINT "useraccount_email_key" UNIQUE ("email"),
        CONSTRAINT "useraccount_role_check" CHECK (role::text = ANY (ARRAY['student'::character varying, 'instructor'::character varying, 'admin'::character varying]::text[]))
      )
      ;

      ALTER TABLE "public"."useraccount"
        OWNER TO "default-admin";
        CREATE TABLE "public"."documentcitation" (
          "document_id" int4 NOT NULL,
          "source_id" int4 NOT NULL,
          CONSTRAINT "documentcitation_pkey" PRIMARY KEY ("document_id", "source_id"),
          CONSTRAINT "documentcitation_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "public"."document" ("document_id") ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT "documentcitation_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "public"."citationsource" ("source_id") ON DELETE NO ACTION ON UPDATE NO ACTION
        )
        ;

        ALTER TABLE "public"."documentcitation"
          OWNER TO "default-admin";

          CREATE TABLE "public"."citationsource" (
            "source_id" int4 NOT NULL DEFAULT nextval('citationsource_source_id_seq'::regclass),
            "title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
            "author" varchar(100) COLLATE "pg_catalog"."default",
            "publication_year" int4,
            "source_type" varchar(50) COLLATE "pg_catalog"."default",
            "url" varchar(255) COLLATE "pg_catalog"."default",
            CONSTRAINT "citationsource_pkey" PRIMARY KEY ("source_id"),
            CONSTRAINT "citationsource_publication_year_check" CHECK (publication_year >= 1500 AND publication_year::numeric <= EXTRACT(year FROM CURRENT_DATE)),
            CONSTRAINT "citationsource_source_type_check" CHECK (source_type::text = ANY (ARRAY['book'::character varying, 'article'::character varying, 'website'::character varying]::text[]))
          )
          ;

          ALTER TABLE "public"."citationsource"
            OWNER TO "default-admin";
