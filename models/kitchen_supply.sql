
CREATE EXTENSION chkpass;

CREATE TABLE user_login (
Id SERIAL NOT NULL PRIMARY KEY,
UUID UUID NOT NULL DEFAULT gen_random_uuid(),
Email VARCHAR(40) NOT NULL UNIQUE,
Password chkpass NOT NULL,
Name VARCHAR(30),
Phone VARCHAR(20),
Reg_Date TIMESTAMP NOT NULL DEFAULT NOW()
)


Insert Into user_login values (
default,default,'fernando.loway@gmail.com','774fc3d0cd951696c91fb5d7101ba620:3c404bedcff87c138cc8f9e5ba6ad8b8','Fernando','08111077075', default)


CREATE TABLE user_address (
	Id SERIAL NOT NULL PRIMARY KEY,
	UserId INT NOT NULL REFERENCES user_login(id),
	Address_Alias TEXT NOT NULL,
	Rec_Name VARCHAR(30) NOT NULL,
	Rec_Phone VARCHAR(20),
	Kode_Pos VARCHAR(6),
	Provinsi VARCHAR(30),
	Kota TEXT NOT NULL,
	Kecamatan TEXT NOT NULL,
	Full_Address TEXT NOT NULL,
	Last_Used TIMESTAMP NOT NULL DEFAULT NOW()
)


INSERT INTO user_address values
(default, 1, 'Rumah - Jakarta', 'Fernando Loway', '08111077075', '11470','DKI Jakarta','Jakarta Barat','Grogol Petamburan','Jl. Tanjung Duren Raya No. 1 Tanjung Duren Selatan', default )



CREATE TABLE product_category (
	Id SERIAL NOT NULL PRIMARY KEY,
	ctg_name VARCHAR(40) NOT NULL UNIQUE,
	upd_time TIMESTAMP NOT NULL DEFAULT NOW(),
	upd_user VARCHAR(30) NOT NULL
)


INSERT INTO product_category VALUES 
(default, unnest (array['Daging', 'Seafood', 'Sayuran & Kacang', 'Buah', 'Biji-bijian', 'Susu', 'Kopi & Teh']), default, 'admin')



CREATE TABLE master_city (
	Id SERIAL NOT NULL PRIMARY KEY,
	City TEXT NOT NULL UNIQUE
)


INSERT INTO master_city VALUES 
(default, unnest (array['Jakarta', 'Tangerang', 'Bandung']))


CREATE TABLE vendor (
	Id SERIAL NOT NULL PRIMARY KEY,
	Vendor_Name VARCHAR(50) NOT NULL UNIQUE,
	Vendor_City_Id INT NOT NULL REFERENCES master_city(id),
	Vendor_Address TEXT NOT NULL,
	REG_DATE TIMESTAMP NOT NULL DEFAULT NOW()
)



INSERT INTO vendor VALUES
(default, 'CV Makmur Bersama', 1, 'Jl. Green Ville, Duri Kepa, Kb. Jeruk, Jakarta Barat', default )


CREATE TABLE vendor_login (
	Id SERIAL NOT NULL PRIMARY KEY,
	UUID UUID NOT NULL DEFAULT gen_random_uuid(),
	Vendor_Id INT NOT NULL REFERENCES vendor(id),
	Email VARCHAR(40) NOT NULL UNIQUE,
	Password chkpass NOT NULL,
	UserName VARCHAR(30),
	Reg_Date TIMESTAMP NOT NULL DEFAULT NOW()
)



Insert Into vendor_login values (
default,default,1,'fernando.loway@yahoo.com','52750c7a893ce18fd09193721793ad35:ca40bc0763d9d4aa196dad2f540765d6','fernando22', default)


CREATE TABLE product (
	Id SERIAL NOT NULL PRIMARY KEY,
	Product_name VARCHAR(50) NOT NULL,
	Ctg_Id INT NOT NULL REFERENCES product_category(id),
	Vendor_Id INT NOT NULL REFERENCES vendor(id),
	Price INT NOT NULL,
	Stock_Unit VARCHAR(10) NOT NULL,
	Minimum NUMERIC(12,2) NOT NULL,
	Step Numeric(12,2) NOT NULL,
	Stock NUMERIC(12,2) NOT NULL,
	upd_user VARCHAR(30) NOT NULL,
	upd_time TIMESTAMP NOT NULL DEFAULT NOW(),
	product_description text
)


INSERT INTO product values
(default, 'Daging Sapi Tenderloin', 1, 1, 100000, 'kg', 5, 0.5, 200, 'fernando22', default, 'Tenderloin atau has dalam memiliki daging yang lebih lembut dan kandungan lemak yang lebih rendah jika dibandingkan dengan sirloin. Hal ini karena otot-otot yang membentuk tenderloin bagian yang sedikit digunakan untuk beraktivitas. Letaknya berada di bagian tengah rusuk dekat otot besar, tepat di depan panggul. Karena proporsi dagingnya lebih sedikit dan memiliki daging yang lembut, maka tenderloin memiliki harga yang lebih mahal. Jika daging Tenderloin disajikan dengan dipotong lagi dalam ukuran yang lebih kecil biasanya disebut steak Fillet Mignon. Sedangkan potongan tenderloin dalam ukuran besar untuk dimakan 2 orang atau lebih disebut Chateaubriand steak. Potongannya diambil dari ujung bawah dari Tenderloin yang masih terdapat daging Sirloin menempel.')



CREATE TABLE Invoice_Hd (
	Id SERIAL NOT NULL PRIMARY KEY,
	Kode_Invoice VARCHAR(20) NOT NULL UNIQUE,
	Invoice_Date TIMESTAMP NOT NULL DEFAULT NOW(),
	TOTAL_PRICE BIGINT NOT NULL,
	User_Id INT NOT NULL REFERENCES user_login(id),
	VendorId INT NOT NULL REFERENCES vendor(id),
	Rec_Name VARCHAR(30) NOT NULL,
	Rec_Phone VARCHAR(20),
	Kode_Pos VARCHAR(6),
	Provinsi VARCHAR(30),
	Kabupaten TEXT NOT NULL,
	Kecamatan TEXT NOT NULL,
	Full_Address TEXT NOT NULL,
	Invoice_Status VARCHAR(10) NOT NULL,
	Approval_Message TEXT,
	Action_By VARCHAR(30)
)


CREATE TABLE Invoice_Dt (
	Id SERIAL NOT NULL PRIMARY KEY,
	Invoice_Id INT NOT NULL REFERENCES Invoice_Hd(id),
	Product_Name VARCHAR(50) NOT NULL,
	Quantity NUMERIC(12,2) NOT NULL,
	Product_Price INT NOT NULL
)




CREATE TABLE product_stock_hist (
	Id SERIAL NOT NULL PRIMARY KEY,
	Product_Id INT NOT NULL REFERENCES product(id),
	Increment NUMERIC(12,2) NOT NULL,
	Decrement NUMERIC(12,2) NOT NULL,
	Stock_Res NUMERIC(12,2) NOT NULL,
	Invoice_Id INT REFERENCES invoice_hd(id),
	upd_user VARCHAR(30) NOT NULL,
	upd_time TIMESTAMP NOT NULL DEFAULT NOW()
)


Insert into product_stock_hist values
(default, 1, 200, 0, 200, null, 'fernando22', default)

CREATE TABLE user_cart (
	Id SERIAL NOT NULL PRIMARY KEY,
	User_Id INT NOT NULL REFERENCES user_login(id),
	Product_Id INT NOT NULL REFERENCES product(id),
	Quantity NUMERIC(12,2) NOT NULL,
	Deliver_date TIMESTAMP NOT NULL
)


Insert into user_cart values
(default, 1, 1, 20, '20181201')
