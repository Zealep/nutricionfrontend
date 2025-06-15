import pandas as pd
from sqlalchemy import create_engine

# Ruta del archivo CSV
ruta_csv = "tabla_alimentos.csv"

# Leer el CSV sin modificar los nombres de columnas
df = pd.read_csv(ruta_csv)

# Configura tu conexión PostgreSQL
usuario = "postgres"
contrasena = "1234"
host = "localhost"
puerto = "5432"
base_datos = "postgres"

# Crear el engine
engine = create_engine(f"postgresql://{usuario}:{contrasena}@{host}:{puerto}/{base_datos}")

# Nombre de la tabla
nombre_tabla = "composicion_alimentos"

# Subir los datos respetando los nombres de columnas
#df.to_sql(nombre_tabla, engine, if_exists='replace', index=False)

# Subir datos con el id y tabla ya creada
df.to_sql(nombre_tabla, engine, if_exists='append', index=False)

print(f"✅ Tabla '{nombre_tabla}' creada exitosamente con columnas: {list(df.columns)}")
