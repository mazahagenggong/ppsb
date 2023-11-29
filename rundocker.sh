while [[ "$#" -gt 0 ]]; do
  case $1 in
    -build|--build)
      build=true
      ;;
    -clear|--clear)
          clear=true
          ;;
    *)
      project_directory=$1
      ;;
  esac
  shift
done


# Jika opsi -build disertakan, lakukan build
if [ "$build" = true ]; then
  docker system prune -fa
  docker build -t ppsb .
fi

# Menghentikan dan menghapus container jika sudah berjalan
docker stop ppsb
docker rm ppsb


# Menentukan direktori proyek dari argumen baris perintah (jika disediakan)
project_directory=${project_directory:-/run/media/mazaha/Data/new/ppsb/ppsb/}

# Jika opsi -clear disertakan
if [ "$clear" = true ]; then
  docker run -p 3000:3000 -v "${project_directory}:/usr/src/app" -d --name ppsb ppsb
elif [ "$clear" = false ]; then
  docker run -p 3000:3000 -v "${project_directory}:/usr/src/app" --name ppsb ppsb
fi
