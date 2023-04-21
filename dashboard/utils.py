from urllib.parse import urlparse
import requests, dotenv, json, socket
from http.client import HTTPConnection, HTTPSConnection

Empty = ""


class Dict(dict):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def __getattr__(self, key):
        if key in self:
            return self[key]
        return Empty

    def __setattr__(self, key, value):
        self[key] = value

    def __getitem__(self, key):
        if key in self:
            return super().__getitem__(key)
        return Empty

    def __setitem__(self, key, value):
        return super().__setitem__(key, value)

    def to_json(self, indent=None):
        return json.dumps(self, indent=indent, sort_keys=True)

    @classmethod
    def from_json(cls, string: str):
        return json.loads(string, object_hook=cls)

    def load_json(self, string: str):
        self.update(self.from_json(string))

    @property
    def template_folder(self):
        return "responses" if self.db else "requests"


ENV = Dict(dotenv.Dotenv(".env"))

RequestActions = Dict(
    FolderExists=("name",),
    CreateFolder=(
        "name",
        "password",
    ),
    GetFolder=(
        "name",
        "password",
    ),
    RenameFolder=(
        "name",
        "password",
        "newName",
    ),
    DeleteFolder=(
        "name",
        "password",
    ),
    #
    #
    #
    DatabaseExists=(
        "name",
        "folder",
        "folderPassword",
    ),
    CreateDatabase=(
        "name",
        "password",
        "folder",
        "folderPassword",
    ),
    GetDatabase=(
        "name",
        "password",
        "folder",
        "folderPassword",
    ),
    RenameDatabase=(
        "name",
        "password",
        "newName",
        "folder",
        "folderPassword",
    ),
    DropDatabase=(
        "name",
        "password",
        "folder",
        "folderPassword",
    ),
    #
    #
    #
    CreateTable=(
        "database",
        "password",
        "name",
        "columns",
        "folder",
        "folderPassword",
    ),
    DropTable=(
        "database",
        "password",
        "name",
        "folder",
        "folderPassword",
    ),
    #
    #
    #
    # AddColumn=(
    #     "database",
    #     "password",
    #     "table",
    #     "column",
    #     "datatype",
    #     "folder",
    #     "folderPassword",
    # ),
    #
    #
    #
    Select=(
        "database",
        "password",
        "table",
        "columns",
        "where",
        "folder",
        "folderPassword",
    ),
    # Insert=(
    #     "database",
    #     "password",
    #     "table",
    #     "values",
    #     "columns",
    #     "multiValues",
    #     "folder",
    #     "folderPassword",
    # ),
    # Update=(
    #     "database",
    #     "password",
    #     "table",
    #     "columns",
    #     "values",
    #     "where",
    #     "folder",
    #     "folderPassword",
    # ),
    Delete=(
        "database",
        "password",
        "table",
        "where",
        "folder",
        "folderPassword",
    ),
    #
    #
    #
    SQL=(
        "database",
        "password",
        "table",
        "statement",
        "folder",
        "folderPassword",
    ),
)

Optionals = ["folder", "folderPassword"]


def get_connection(timeout=2):
    DB_SERVER_SCHEME = str(ENV.DB_SERVER_SCHEME).lower()
    DB_SERVER_ADDRESS = ENV.DB_SERVER_ADDRESS
    DB_SERVER_PORT = ENV.DB_SERVER_PORT

    connection_class = (
        HTTPSConnection if DB_SERVER_SCHEME == "https" else HTTPConnection
    )

    if DB_SERVER_SCHEME != "https":
        DB_SERVER_SCHEME = "http"

    if not DB_SERVER_ADDRESS:
        DB_SERVER_ADDRESS = socket.gethostbyname(socket.gethostname())
        print(
            "'Database Server' is assumed to be on the same machine as DB_SERVER_ADDRESS isn't provided in the '.env' file."
        )

    try:
        DB_SERVER_PORT = int(DB_SERVER_PORT)
    except:
        DB_SERVER_PORT = 0

    if not DB_SERVER_PORT:
        DB_SERVER_PORT = 443 if DB_SERVER_SCHEME.lower == "https" else 80
        print(
            f"DB_SERVER_PORT not provided in the '.env' file, '{DB_SERVER_PORT}' is assumed."
        )

    return connection_class(DB_SERVER_ADDRESS, DB_SERVER_PORT, timeout=timeout)


def make_post_request(dictObj: Dict, timeout=1):
    status, data = 0, Dict()
    try:
        connection = get_connection(timeout)
        connection.request("POST", "", dictObj.to_json())
        response = connection.getresponse()
        body = response.read(response.headers.get(b"content-length"))

        if (status := response.status) == 200:
            data.load_json(body)

    except Exception as ex:
        print(f"{ex.__class__}: {ex}")

    return status, data


def log_request(
    is_post: bool,
    request_data: Dict,
    response_data: Dict,
):
    log = f"""
                 Is Post?:  {is_post}
             Request Data:  {request_data.to_json(28)}
            Request Valid:  {request_data.valid}
    DB Request Successful:  {request_data.db}
         DB Response Data:  {response_data}
    """
    print(log)
