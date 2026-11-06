"""Check generated First Steps pages without starting a web server."""
from html.parser import HTMLParser
from pathlib import Path


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []

    def handle_starttag(self, tag, attrs):
        if tag == 'a':
            self.links.append(dict(attrs))


build = Path(__file__).resolve().parents[1] / 'apps/first-steps/.next/server/app'
for route in ('/', '/about', '/contact', '/pricing'):
    page = build / ('index.html' if route == '/' else route[1:] + '.html')
    parser = Links()
    parser.feed(page.read_text(encoding='utf-8'))
    hrefs = {link.get('href') for link in parser.links}
    expected = {'/about'} if route == '/' else {'/', '/about', '/contact', '/pricing'}
    assert expected <= hrefs, (route, hrefs)
    if route != '/':
        active = [link['href'] for link in parser.links if 'active-link' in link.get('class', '')]
        assert active == [route], (route, active)
    print('PASS generated page and links:', route)
