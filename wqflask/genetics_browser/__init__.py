import sys
import jinja2

from flask import Flask, Blueprint, render_template

genetics_browser = Blueprint('genetics_browser', __name__,
                    template_folder='templates')

def genome_track(name, uri):
    conf = {}
    conf['trackType'] = 'BDTrack'
    conf['name'] = name
    conf['twoBitURI'] = uri
    conf['desc'] = 'Mouse reference genome build GRCm38'
    conf['tier_type'] = 'sequence'
    conf['provides_entrypoints'] = True
    return conf

def qtl_track(name, uri):
    conf = {}
    conf['trackType'] = 'BDTrack'
    conf['name'] = name
    conf['uri'] = uri
    conf['tier_type'] = 'qtl'
    conf['renderer'] = 'qtlRenderer'
    return conf

def gwas_track(name, uri):
    conf = {}
    conf['trackType'] = 'BDTrack'
    conf['name'] = name
    conf['bwgURI'] = uri
    conf['forceReduction'] = -1
    conf['renderer'] = 'gwasRenderer'
    return conf
