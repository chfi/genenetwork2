import sys
import jinja2

from flask import Flask, Blueprint, render_template

genetics_browser = Blueprint('genetics_browser', __name__,
                    template_folder='templates')
