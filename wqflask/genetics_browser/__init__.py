import functools

from flask import Blueprint

genetics_browser = Blueprint('genetics_browser', __name__,
                             template_folder='templates')

def bd_track(name):
    conf = {}
    conf['trackType'] = 'BDTrack'
    conf['name'] = name
    return conf

def multi_track(name):
    conf = bd_track(name)
    conf['tier_type'] = 'multi'
    conf['renderer'] = 'multi'
    # TODO: should the grid be configurable?
    multi = {'multi_id': name,
             'grid': True,
             'grid_offset': 0,
             'grid_spacing': 10}
    conf['multi'] = multi
    return conf

def set_sub_track(track, multi_config, offset, z):
    sub = {'multi_id': multi_config['multi']['multi_id'],
           'offset': offset,
           'z': z}
    track['hidden'] = True
    track['sub'] = sub

def genome_track(name, uri):
    conf = bd_track(name)
    conf['twoBitURI'] = uri
    conf['desc'] = 'Mouse reference genome build GRCm38'
    conf['tier_type'] = 'sequence'
    conf['provides_entrypoints'] = True
    return conf

def qtl_track(name, uri):
    conf = bd_track(name)
    conf['uri'] = uri
    conf['tier_type'] = 'qtl'
    conf['renderer'] = 'qtlRenderer'
    return conf

def gwas_track(name, uri):
    conf = bd_track(name)
    conf['bwgURI'] = uri
    conf['forceReduction'] = -1
    conf['renderer'] = 'gwasRenderer'
    return conf

def snp_track(name, uri):
    conf = bd_track(name)
    conf['jbURI'] = uri
    conf['jbQuery'] = ""
    style = {'type': 'default',
             'style': {'glyph': 'HISTOGRAM',
                       'MIN': 0.0,
                       'MAX': 1000,
                       'AUTOMAX': 'yes',
                       'AXISCENTER': 'yes',
                       'STEPS': 500,
                       'HIDEAXISLABEL': 'yes',
                       'COLOR1': 'red',
                       'COLOR2': 'red',
                       'COLOR3': 'red',
                       'HEIGHT': 120}}
    conf['style'] = [style]
    conf['refetchOnZoom'] = True
    return conf
