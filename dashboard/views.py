from django.shortcuts import render
from django.http.request import HttpRequest
from .utils import *


def process_request(request: HttpRequest):
    request_data = Dict(path=request.path)

    response_status = 0
    response_data = Dict()

    if is_post := (request.method == "POST"):
        post = request.POST
        for k, v in post.items():
            if k == "csrfmiddlewaretoken":
                continue
            request_data[k] = v

        if parameters := RequestActions[request_data.action]:
            validated_data = Dict(action=request_data.action)
            for name in parameters:
                value = request_data[name]
                if not value:
                    if not (
                        ((name == "where") and (request_data.action == "Select"))
                        or (name in Optionals)
                    ):
                        validated_data.clear()
                        break

                validated_data[name] = value

            if validated_data:
                request_data.valid = True
                # response_status, response_data = make_post_request(validated_data)

                request_data.db = response_status == 200
                request_data.db_error = not request_data.db
        else:
            request_data.invalid_action = True

    return is_post, request_data, response_data


def home(request: HttpRequest):
    return render(request, "home.html", context=Dict(request=request))


def parse_request(request: HttpRequest):
    is_post, request_data, response_data = process_request(request)

    log_request(
        is_post,
        request_data,
        response_data,
    )
    template = f"{request_data.template_folder}{request.path}"
    
    if request_data.invalid_action:
        template = 'errors'
        request_data.dump = request_data.to_json(4)
        request_data.back = request_data.path[1:].title()

    return render(
        request,
        f'{template}.html',
        context=response_data or request_data,
    )


folders = lambda request: parse_request(request)
databases = lambda request: parse_request(request)
tables = lambda request: parse_request(request)
crud = lambda request: parse_request(request)
