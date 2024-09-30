import { http, HttpResponse } from "msw";

export const handleGet = (path: string) => {
    return http.get(path, async () => {
        return HttpResponse.json(await fetch("/mock-responses" + path + ".json").then(response => response.json()));
    })
}
