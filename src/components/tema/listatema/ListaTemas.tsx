import { DNA } from "react-loader-spinner";
import type Tema from "../../../models/Tema";
import CardTemas from "../cardtema/CardTema";
import { useContext, useEffect, useState } from "react";
import { buscar } from "../../../services/Service";
import { AuthContext } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ToastToastAlerta } from "../../../uttils/ToastAlert";

function ListaTemas() {
  const navigate = useNavigate();

  const [temas, setTemas] = useState<Tema[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { usuario, handleLogout } = useContext(AuthContext);

  const token = usuario.token;

  async function buscarTemas() {
    try {
      setIsLoading(true);
      await buscar("/temas", setTemas, {
        headers: { Authorization: token },
      });
    } catch (error: any) {
      if (error.toString().includes("401")) {
        handleLogout();
      }
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    if (token === "") {
      ToastToastAlerta("Você precisa estar logado!", "info");
      navigate("/");
    }
  }, [token]);
  useEffect(() => {
    buscarTemas();
  }, [temas.length]);

  return (
    <>
      {isLoading && (
        <DNA
          visible={true}
          height="200"
          width="200"
          ariaLabel="dna-loading"
          wrapperStyle={{}}
          wrapperClass="dna-wrapper mx-auto"
        />
      )}
      <div className="flex justify-center w-full my-4">
        <div className="container flex flex-col mx-2">
          {!isLoading && temas.length === 0 && (
            <span className="text-3xl text-center my-8">
              Nenhum Tema foi encontrado!
            </span>
          )}

          <div
            className="grid grid-cols-1 md:grid-cols-2
                                    lg:grid-cols-3 gap-8"
          >
            {temas
              .sort((a, b) => a.id - b.id)
              .map((tema: Tema) => (
                <CardTemas key={tema.id} tema={tema} />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
export default ListaTemas;
