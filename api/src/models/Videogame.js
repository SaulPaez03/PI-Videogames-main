const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
	// defino el modelo
	sequelize.define(
		"videogame",
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: DataTypes.UUIDV4,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			description: {
				type: DataTypes.TEXT,
			},
			released: {
				type: DataTypes.DATEONLY,
			},
			rating: {
				type: DataTypes.FLOAT,
			},
			background_image: {
				type: DataTypes.STRING,
			},
			platforms: {
				type: DataTypes.ARRAY(DataTypes.STRING),
			},
		},
		{
			createdAt: false,
			updatedAt: false,
		}
	);
};
// ID: * No puede ser un ID de un videojuego ya existente en la API rawg
// Nombre *
// Descripción *
// Fecha de lanzamiento
// Rating
// Plataformas *
